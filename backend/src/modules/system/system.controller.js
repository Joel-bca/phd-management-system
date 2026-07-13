import supabaseAdmin from "../../config/supabaseAdmin.js";

export const getSystemManifest = async (req, res) => {
  try {
    // Fetches the latest system version and build info from vision_manifest
    // Uses supabaseAdmin (Service Key) to bypass potential RLS issues for public info
    const { data, error } = await supabaseAdmin
      .from("vision_manifest")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
