import {useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate} from "react-router";

function LoginCard(){
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm()

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`http://localhost:3030/Users/login/`, data)
                    if (res.status === 200) {
                        localStorage.setItem('token', res.data.token);
                        navigate(`/homePage`)
                    }
        }catch (err){
            console.error('Login error:', err);
            alert('Failed to LogIn')
        }

    }

    return (
        <div className="flex justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email:</label>
                    <input
                        {...register("email",{required:true})}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Password:</label>
                    <input
                        {...register("password",{required:true})}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-200 cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>

    )
}

export default LoginCard