const User = require('../../model/userModel/User');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');


//login e-commerce
const ecomloginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid email or password' });
        if(!user.ecom) return res.status(404).json({message: 'You are not authorized to login in Ecommerce'})
        // Check if the password matches
        const isMatch = compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password in  ecom' });

 
        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
 
        res.status(200).json({ message: 'Login successful in Ecom', token });
 
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports =  ecomloginUser;