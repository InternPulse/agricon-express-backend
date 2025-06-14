import app from './app';
import { config } from './config/config.env';
const port = config.PORT;
app.listen(port, () => {
    console.log(`Booking Listening on port localhost:${port}`);
});
