import Footer from "@/components/home/footer";
import HomePage from "@/components/home/homePage";
import Navbar from "@/components/home/navbar";

export default function HomePageK() {
  return(
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Navbar/>
        <HomePage />
        <Footer/>
      </div>
  )
  
}
