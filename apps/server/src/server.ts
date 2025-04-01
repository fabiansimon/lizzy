import app from './app';
import { env } from './env';

const PORT = env.PORT || 5001;

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
