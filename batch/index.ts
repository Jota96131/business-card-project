import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const deletePreviousDayData = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startOfYesterday = new Date(yesterday);
  startOfYesterday.setHours(0, 0, 0, 0);
  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setHours(23, 59, 59, 999);

  const { data: users, error: fetchError } = await supabase
    .from("users")
    .select("user_id")
    .gte("created_at", startOfYesterday.toISOString())
    .lte("created_at", endOfYesterday.toISOString());

  if (fetchError) {
    console.error("ユーザー取得エラー:", fetchError);
    return;
  }

  if (!users || users.length === 0) {
    console.log("削除対象のユーザーはいません");
    return;
  }

  const userIds = users.map((u) => u.user_id);

  const { error: skillError } = await supabase
    .from("user_skill")
    .delete()
    .in("user_id", userIds);

  if (skillError) {
    console.error("user_skill削除エラー:", skillError);
    return;
  }

  const { error: userError } = await supabase
    .from("users")
    .delete()
    .in("user_id", userIds);

  if (userError) {
    console.error("users削除エラー:", userError);
    return;
  }

  console.log(`${userIds.length}件のユーザーとスキルデータを削除しました`);
};

deletePreviousDayData();
