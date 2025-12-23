import { useEffect, useState } from "react";

export default function useIsMobile(){
    const [isMobile, setIsMobile] = useState(document.documentElement.clientWidth < 769);

    useEffect(() => {
        const onresize = () => {
            if(!isMobile && document.documentElement.clientWidth < 769){
                setIsMobile(true);
            } else if(isMobile && document.documentElement.clientWidth > 769){
                setIsMobile(false);
            }
        }
        window.addEventListener("resize", onresize, {passive:true})

        return () => {
            window.removeEventListener("resize", onresize);
        }
    }, [isMobile])

    return isMobile;
}