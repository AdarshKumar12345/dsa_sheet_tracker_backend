async function createUser(req , res){
    try{
        if(!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }
        const {name , email , password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            });
        }
        const newUser = await User.create({name , email , passwod});
        return res.status(201).json({
            success: true,
            data: newUser,
        });

    }
    catch(error){
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}

const findUser = async(email) =>{
    try{
        const user = await User.findOne({
            email
        })
        return user;

    }
    catch(error){
        console.error("Error finding user:", error);
        return null;
    }
}

export {createUser , findUser};
