const initialState={
    email:null
};

const setCurrEmail=(state=initialState,action)=>{
    switch(action.type)
    {
        case 'SET_USER_EMAIL':
            return{
                ...state,
                email: action.payload
            };
            default:
            return state;
    }
}

export default setCurrEmail;