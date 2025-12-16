import { environment } from "src/environment/environment";

export const baseGraphCMSFetch = async (mutation: {query: string}) => {
    const isMutation = /\bmutation\b/i.test(mutation?.query || "");

    // Bloquear mutations quando em produção ou hospedado no GitHub Pages
    // (evita que um site estático exponha alterações no CMS)
    if (isMutation) {
        try {
            const host = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '';
            const isGithubPages = host.endsWith('github.io');
            if (environment.production || isGithubPages) {
                return { errors: [{ message: 'Mutations are disabled in this hosted environment.' }] };
            }
        } catch (e) {
            // se houver qualquer problema ao detectar o host, não bloquear por padrão
        }
    }

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