import { Client, Databases } from "node-appwrite";

export default async ({ req, res }) => {
  // Configuration Appwrite
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const payload = JSON.parse(req.body);
    const { qr_id, pilgrim_name, family_whatsapp } = payload;

    // Validation
    if (!qr_id || !pilgrim_name || !family_whatsapp) {
      return res.json({ error: "Champs manquants : qr_id, pilgrim_name, family_whatsapp" }, 400);
    }

    // Enregistrement dans la collection 'hajj_bags'
    const bag = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,   // ID de ta base
      process.env.APPWRITE_COLLECTION_ID, // ID de ta collection
      qr_id, // Utilisé comme documentId (doit être unique)
      {
        qr_id,
        pilgrim_name,
        family_whatsapp,
        activated_at: new Date().toISOString(),
        status: "active"
      }
    );

    return res.json({
      success: true,
      message: "Bagage activé avec succès",
      bag_id: qr_id
    });

  } catch (error) {
    console.error("Erreur :", error.message);
    return res.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
};
