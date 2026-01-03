'use client'
import { useForm, SubmitHandler} from "react-hook-form"

 type InputTpes = {
    name:string;
    email:string;
}

export function BasicForm(){
    const {register, handleSubmit} = useForm<InputTpes>();
    const onsubmit :SubmitHandler<InputTpes> = (data)=>{
        alert(data.name)
    }

    return(
        <div className="border border-black flex-col items-center justify-center flex bg-amber-300 p-6 w-1/4">
            <h1 className="text-3xl" >Basic Form</h1>
        <form className="p-6 gap-4 flex flex-col  " onSubmit={handleSubmit(onsubmit)}>
            <input className="border-2 border-black" placeholder="name" {...register("name")}/>
            <input className="border-2 border-black" placeholder="Email" {...register("email")}/>
            <input className="bg-black text-white p-2 rounded" type="submit"/>
        </form>
        </div>
    )
}