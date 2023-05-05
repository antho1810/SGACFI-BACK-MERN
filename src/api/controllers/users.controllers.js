import User from '../../models/User.js'

export const getUsers = async (req,res) => {

    const foundUsers = await User.find()

    res.json(foundUsers)

}