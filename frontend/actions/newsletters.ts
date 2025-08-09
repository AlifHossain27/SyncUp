const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function create_newsletter(title: string, content: string, slug: string, thumbnail: string, status: string){
    const resp = await fetch(`${API_BASE_URL}/api/newsletter/create/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            'title': title,
            'content': content,
            'slug': slug,
            'thumbnail': thumbnail,
            'status': status
        }),
    })
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function update_newsletter(title: string, content: string, slug: string, thumbnail: string, status: string, url_slug: string){
    const resp = await fetch(`${API_BASE_URL}/api/newsletter/${url_slug}/`,{
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            'title': title,
            'content': content,
            'slug': slug,
            'thumbnail': thumbnail,
            'status': status
        }),
    })
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function get_newsletter(url_slug: string){
    const resp = await fetch(`${API_BASE_URL}/api/newsletter/${url_slug}/`,{
        method: "GET",
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

export async function get_draft_newsletters() {
    const resp = await fetch(`${API_BASE_URL}/api/newsletters/drafts/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function get_archive_newsletters() {
    const resp = await fetch(`${API_BASE_URL}/api/newsletters/archive/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    const data = await resp.json();
    return {
        ok: resp.ok,
        status: resp.status,
        body: data,
    };
}

export async function delete_newsletter(uuid: string) {
    const resp = await fetch(`${API_BASE_URL}/api/newsletter/${uuid}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
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