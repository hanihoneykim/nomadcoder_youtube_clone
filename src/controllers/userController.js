export const join = (req,res) => res.send("Join");
export const edit = (req,res) => res.send("User Edit");
export const remove = (req,res) => res.send("User Remove");
export const login = (req,res) => res.send("User Login");
export const logout = (req,res) => res.send("User Logout");
export const see = (req,res) => {
    return res.send(`See User #${req.params.id}`);}