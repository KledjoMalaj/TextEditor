import RegisterCard from "./RegisterCard.jsx";
import LoginCard from "./LoginCard.jsx";

function LandingPage(){
    return(
        <>
            <div className={'grid grid-cols-2'} >
                <RegisterCard/>
                <LoginCard/>
            </div>
        </>
    )
}
export default LandingPage