import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"


export const useAuth = () => {
    return useSelector((state: RootState) => state.auth)
}



// didnt used it yet