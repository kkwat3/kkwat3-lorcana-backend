import { rphQuery } from "./gql.js";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing event id" });

  const query = `
    query Event($id: ID!) {
      event(id: $id) {
        id
        name
        startDate
        endDate
        location { city country }
        tournamentInstances {
          id
          name
          status
        }
      }
    }
  `;

  try {
    const data = await rphQuery(query, { id });
    return res.status(200).json({ ok: true, event: data?.event ?? null });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
