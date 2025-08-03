export async function add_subscriber(first_name: string, last_name: string, email: string, department: string){
    const resp = await fetch("http://localhost:8000/api/subscriber/create/",{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
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
    const resp = await fetch(`http://localhost:8000/api/subscriber/${uuid}/`,{
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
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
    const resp = await fetch(`http://localhost:8000/api/subscriber/${uuid}/`,{
        method: 'DELETE',
        headers: {'Content-Type':'application/json'}
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