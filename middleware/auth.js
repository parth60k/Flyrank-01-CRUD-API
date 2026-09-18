
const supabase= require("../supabase");

async function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            error: "Access token required"
        });
    }

    const token= authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            error: "Access token required"
        });
    }

    try{

        const {data,error} = await supabase.auth.getUser(token);

        if(error ||!data.user){
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }
        req.user=data.user;
        next();

    }catch(error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

module.exports= authMiddleware;