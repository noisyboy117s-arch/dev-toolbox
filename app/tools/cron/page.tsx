import CronTool from "@/components/CronTool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Generator | DevToolbox",
  description: "Generate and explain cron expressions easily. Visual editor for scheduling jobs with clear human-readable descriptions.",
  keywords: ["cron generator", "crontab", "cron expression", "schedule jobs", "online tool"],
};

export default function CronPage() {
  return (
    <div className="py-12">
      <CronTool />
      
      <section className="max-w-4xl mx-auto px-8 mt-16 prose prose-slate text-black">
        <h2 className="text-2xl font-bold mb-4">What is a Cron Job?</h2>
        <p className="text-gray-700 mb-4">
          A cron job is a Linux command used for scheduling tasks to be executed sometime in the future. This is normally used to schedule a job that is executed periodically — for example, to send out a notice every morning.
        </p>
        <h3 className="text-xl font-semibold mb-2">Cron Format</h3>
        <p className="text-gray-700 mb-4">
          A cron expression is a string consisting of five or six fields separated by white space that represents a set of times, normally as a schedule to execute some routine.
        </p>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          * * * * *<br/>
          | | | | |<br/>
          | | | | +----- Day of week (0 - 6) (Sunday=0)<br/>
          | | | +------- Month (1 - 12)<br/>
          | | +--------- Day of month (1 - 31)<br/>
          | +----------- Hour (0 - 23)<br/>
          +------------- Minute (0 - 59)
        </pre>
      </section>
    </div>
  );
}
