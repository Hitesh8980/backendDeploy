const authorize=(permittedrole)=>{
    return (req,res,next)=>{
        const userRole=req.user.role
        if(permittedrole.includes(userRole)){
            next()
        }else {
            res.status(403).json({ msg: 'Sorry, you are not authorized. Please contact admin.' }); 
        }
    }
}
module.exports=authorize