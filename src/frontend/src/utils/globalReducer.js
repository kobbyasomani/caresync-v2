export default function globalReducer(state, action) {
    switch (action.type) {
        case "setUser":
            return {
                ...state,
                user: action.data
            }
    }
}