import { app } from './app'
const PORT = process.env.PORT || 3000

const cors = require('cors');
app.use(cors());


app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`)
})
