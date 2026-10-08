import Navbar from "./Navbar";
import PageBackground from "./PageBackground";

export default function PageLayout({children}){
return(
    <div className="relative isolate min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <PageBackground />
        <Navbar />
        {children}
    </div>
)
}