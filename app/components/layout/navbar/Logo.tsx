import { ShoppingBag } from "lucide-react";

export default function Logo(){
    return(
        <div className="p-6 text-cyan-300 text-3xl flex justify-center items-center gap-2 font-extrabold">
         <ShoppingBag />
         <h1 className="text-pink-400">NexaShop</h1>
        </div>
    )
}