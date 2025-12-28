export const logErrors = (message: string = "", error: string = "") => {
    const errorMessage = `${message}\n${error}`;
    alert(errorMessage);
    console.error(errorMessage);
}

export const dateToStringFormat = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export const dateToOtherStringFormat = (date: Date) => {
    const dateS = date + "";
    return `${dateS.slice(8, 10)}/${dateS.slice(5,7)}/${dateS.slice(0,4)}`;
}