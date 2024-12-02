require('dotenv').config();
const supabase = require('./supabaseClient');
const { v4: uuidv4 } = require('uuid');

async function addNewUser(profile) {
  try {
    // Primeiro, verificar se o usuário existe na autenticação
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(user => user.email === profile.email);

    if (existingUser) {
      console.log('Atualizando usuário existente:', existingUser);
      
      // Atualizar perfil existente
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          is_premium: profile.is_premium || false,
          expiration_date: profile.is_premium ? profile.expiration_date : null,
          phone_number: profile.phone_number || null,
          phone_local_code: profile.phone_local_code || null,
          external_id: profile.external_id || null,
          updated_at: new Date().toISOString(),
          email: profile.email // Garantir que o email está atualizado
        })
        .eq('id', existingUser.id)
        .select();

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        return { success: false, error: updateError };
      }

      console.log('Perfil atualizado com sucesso:', updateData);
      return { success: true, data: updateData, action: 'updated' };
    }

    // Se não existe, criar novo usuário
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: profile.email,
      password: uuidv4(),
      email_confirm: true,
      user_metadata: {
        name: profile.name
      }
    });

    if (authError) {
      console.error('Erro ao criar usuário na autenticação:', authError);
      return { success: false, error: authError };
    }

    if (!authUser || !authUser.user) {
      console.error('Erro: Usuário não foi criado corretamente');
      return { success: false, error: 'Falha na criação do usuário' };
    }

    console.log('Novo usuário criado:', authUser.user);

    // Aguardar um momento para garantir que o perfil foi criado
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Atualizar o perfil recém-criado
    const { data: newProfileData, error: newProfileError } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        is_premium: profile.is_premium || false,
        expiration_date: profile.is_premium ? profile.expiration_date : null,
        phone_number: profile.phone_number || null,
        phone_local_code: profile.phone_local_code || null,
        external_id: profile.external_id || null,
        updated_at: new Date().toISOString(),
        email: profile.email
      })
      .eq('id', authUser.user.id)
      .select();

    if (newProfileError) {
      console.error('Erro ao configurar novo perfil:', newProfileError);
      return { success: false, error: newProfileError };
    }

    console.log('Novo perfil configurado com sucesso:', newProfileData);
    return { success: true, data: newProfileData, action: 'created' };

  } catch (err) {
    console.error('Erro inesperado:', err);
    return { success: false, error: err };
  }
}

// Exemplo de uso
(async () => {
  const randomPhone = Math.floor(Math.random() * 900000000 + 100000000).toString();
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0];
  const externalId = `SEC_${timestamp}_${uuid}`;
  
  const result = await addNewUser({
    email: `toni@ktsgrupo.com`,
    name: 'Carlos Eduardo',
    is_premium: true,
    expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    phone_number: randomPhone,
    phone_local_code: '11',
    external_id: externalId
  });

  console.log('Resultado final:', result);
})();
