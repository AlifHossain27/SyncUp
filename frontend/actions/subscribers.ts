const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function get_subscriber(){
    const resp = await fetch(`${API_BASE_URL}/api/subscribers/`,{
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
    })
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function add_subscriber(first_name: string, last_name: string, email: string, department: string){
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/create/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'department': department
        })
    })
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function update_subscriber(uuid: string, first_name: string, last_name: string, email: string, department: string){
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/${uuid}/`,{
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify({
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'department': department
        })
    })
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function delete_subscriber(uuid: string){
    const resp = await fetch(`${API_BASE_URL}/api/subscriber/${uuid}/`,{
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},
        credentials: 'include'
    })
    let data = null;
    if (resp.status !== 204) {
        try {
            data = await resp.json();
        } catch (e) {
            console.warn("No JSON to parse:", e);
        }
    }
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function uploadSubscribersFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subscriber/upload/`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    let data = null;
    try {
        data = await resp.json();
    } catch (e) {
        console.warn("No JSON returned from upload:", e);
    }

    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}