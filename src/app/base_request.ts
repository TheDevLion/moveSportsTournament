import { environment } from "src/environment/environment";

export const baseGraphCMSFetch = async (mutation: {query: string}) => {
    var data = await fetch(environment.apiUrl, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "authorization": `Bearer ${environment.graphCmsToken}`
        },
        body: JSON.stringify(mutation)
    }).then(resp => resp.json());

    return data;
}