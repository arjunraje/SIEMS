import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config /db';
import { startReminderJob } from './jobs/reminderJob';

const PORT=process.env.PORT || 5000
AppDataSource.initialize().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
        console.log('Server timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

        startReminderJob();
    });
}).catch((err)=>{
    console.error('database connection faild:',err);
});
