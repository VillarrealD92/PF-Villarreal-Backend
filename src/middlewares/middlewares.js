export const checkRegisteredUser = (req, res, next) => {
    if(req.user?.user) return res.redirect("/profile")
    return next()
}

export const auth = (req, res, next) => {
    if(req.session?.user) return next()
    res.redirect('/')
}

export const checkAdminPermissions = (req, res, next) => {
    const sessionActive = req.user.user
    if (sessionActive == undefined) return res.send("Login please")
    if(req.user.user.role !== "admin") return res.status(403).send("Not allowed")
    next()
}

export const checkUserPermissions = (req, res, next) => {
    const sessionActive = req.user.user
    if (sessionActive == undefined) return res.send("Login please")
    if(req.user.user.role !== "user") return res.status(403).send("Not allowed")
    next()
}

export const checkPremiumPermissions = (req, res, next) => {
    const sessionActive = req.user.user
    if (sessionActive == undefined) return res.send("Login please")
    if(req.user.user.role != "premium") return res.status(403).send("Not allowed")
    next() 
}

export const checkAdminPremiumPermissions = (req, res, next) => {
    const sessionActive = req.user.user
    if (sessionActive == undefined) return res.send("Login please")
    if(req.user.user.role != "premium" && req.user.user.role != "admin") return res.status(403).send("Not allowed")
    next() 
}

export const checkUserPremiumPermissions = (req, res, next) => {
    const sessionActive = req.user.user
    if (sessionActive == undefined) return res.send("Login please")
    if(req.user.user.role != "premium" && req.user.user.role != "user") return res.status(403).send("Not allowed")
    next() 
}