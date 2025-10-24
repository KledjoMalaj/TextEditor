import RegisterCard from "./RegisterCard.jsx";
import LoginCard from "./LoginCard.jsx";

function LandingPage(){
    return(
        <>
            <div className={'bg-blue-900 text-white p-5 m-1 rounded flex justify-center shadow-lg'}>
                <h1
                    className="text-8xl text-white text-border"
                    style={{ fontFamily: "'BBH Sans Bartle', sans-serif" }}
                >
                    Text/Editor
                </h1>
                <h1 className={'mt-16 ml-10'}>V - 0.1</h1>


            </div>
            <div className={'grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-15 mt-25  m-10'} >
                <RegisterCard/>
                <LoginCard/>
            </div>
        </>
    )
}
export default LandingPage