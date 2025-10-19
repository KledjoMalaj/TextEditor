import express from "express"
import cors from "cors"
import documentRoutes from './routes/documentRoutes.js';
import usersRoutes from "./routes/usersRoutes.js";

const app = express();
const port = 3030

app.use(cors())
app.use(express.json());

app.use('/Documents', documentRoutes);
app.use('/Users', usersRoutes)

app.listen(port, () => {
    console.log(`Server running On port => ${port}`)
})