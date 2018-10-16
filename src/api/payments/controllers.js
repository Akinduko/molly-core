
export default ({ entities: { payments } }) => ({

    create: async (req, res) => {
        // const body = req.body
        // let model
        // try {
        //     model = payments.model()
        // } catch (error) {
        //     model = payments.setModel()
        // }
        try {
            // const valid = await payments.validateCreate(body)
            // const payment = valid?await payments.create(model,body):{ error: "Invalid payment Body Parameters" }
            res.status(200).json('payment')
        } catch (error) {
            console.log({error})
            res.status(400).json({ error: error })
        }
    }
})