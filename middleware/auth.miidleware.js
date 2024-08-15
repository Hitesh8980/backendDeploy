const jwt=require('jsonwebtoken')
const authentication=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]
    try {
        if(!token){
            return res.status(403).json({msg:'sorry token not found'})
        }else{
            jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
                if(err){
                    return res.status(403).json({msg:'sorry error in authenticationg'})
                }if(decoded){
                    req.user={
                        id:decoded.id,
                        role:decoded.role
                    }
                    next()
                }
            });
        }
        
    } catch (error) {
        
    }
};
module.exports=authentication