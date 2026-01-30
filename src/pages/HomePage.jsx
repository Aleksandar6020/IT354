import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
    const [wiki, setWiki] = useState({ loading: true, error: null, data: null })

    useEffect(() => {
        let cancelled = false

        async function loadWiki() {
            try {
                const res = await fetch(
                    "https://en.wikipedia.org/api/rest_v1/page/summary/Pallas%27s_cat"
                )
                if (!res.ok) throw new Error(`Wikipedia request failed: ${res.status}`)
                const data = await res.json()

                if (!cancelled) {
                    setWiki({ loading: false, error: null, data })
                }
            } catch (e) {
                if (!cancelled) {
                    setWiki({ loading: false, error: e?.message || 'Failed to load Wikipedia', data: null })
                }
            }
        }

        loadWiki()

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div className="container">
            <h1>Manuls</h1>

            <p>
                Pallas&apos;s cats are small wild cats from Central Asia known for their fluffy coats.
            </p>

            <div className="card" style={{ marginTop: 16 }}>
                <h2>About Pallas&apos;s cat (Wikipedia)</h2>

                {wiki.loading && <p>Loading…</p>}
                {wiki.error && <p>Could not load Wikipedia info: {wiki.error}</p>}

                {wiki.data && (
                    <>
                        {wiki.data.thumbnail?.source && (
                            <img
                                className="detailsImage"
                                src={wiki.data.thumbnail.source}
                                alt={wiki.data.title || "Pallas's cat"}
                            />
                        )}

                        <p>{wiki.data.extract}</p>

                        {wiki.data.content_urls?.desktop?.page && (
                            <a
                                className="button buttonSecondary"
                                href={wiki.data.content_urls.desktop.page}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Read more on Wikipedia
                            </a>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default HomePage
