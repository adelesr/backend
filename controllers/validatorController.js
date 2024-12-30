export const isPasswordCorrect = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password); ;  
}
export const validateMailAddress = (mailAddress) => {
    const pattern =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(mailAddress);
}