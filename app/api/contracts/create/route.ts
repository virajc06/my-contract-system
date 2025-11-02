import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // if(!request){
    //   return NextResponse.json(
    //     { error: 'Request body missing' },
    //     { status: 500 }
    //   );
    // }
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // console.log("env here:", supabaseUrl, supabaseKey)
    // Check if they exist
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // Create client
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await request.json();
    const { client_name, contract_data } = body;

    const { data, error } = await supabase
      .from('contracts')
      .insert([
        {
          client_name: client_name,
          contract_data: contract_data,
          status: 'Draft',
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data: data }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
