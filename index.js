require('dotenv').config();
const supabase = require('./supabaseClient');
const { v4: uuidv4 } = require('uuid');

async function addNewUser(profile) {
  try {
    // Buscar todos os usuários com paginação
    let allUsers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
        page: page,
        perPage: 1000
      });
      
      if (getUserError) {
        console.error('Erro ao listar usuários:', getUserError);
        return { success: false, error: getUserError };
      }

      if (users.length === 0) {
        hasMore = false;
      } else {
        allUsers = [...allUsers, ...users];
        page++;
      }
    }

    console.log('Total de usuários encontrados:', allUsers.length);
    console.log('Procurando por email:', profile.email);

    // Encontrar o usuário na lista
    const user = allUsers.find(u => u.email.toLowerCase() === profile.email.toLowerCase());

    let userId;

    if (!user) {
      console.log('Usuário não encontrado, criando novo usuário...');
      // Criar novo usuário
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: profile.email,
        email_confirm: true,
        password: uuidv4(), // Senha aleatória
        user_metadata: {
          name: profile.name
        }
      });

      if (createError) {
        console.error('Erro ao criar usuário:', createError);
        return { success: false, error: createError };
      }

      console.log('Novo usuário criado:', newUser);
      userId = newUser.user.id;
    } else {
      console.log('Usuário encontrado:', user);
      userId = user.id;
    }

    // Verificar se o perfil existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      console.log('Perfil não encontrado, criando novo perfil...');
      // Criar novo perfil
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            name: profile.name,
            is_premium: profile.is_premium || false,
            expiration_date: profile.is_premium ? profile.expiration_date : null,
            phone_number: profile.phone_number || null,
            phone_local_code: profile.phone_local_code || null,
            external_id: profile.external_id || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email: profile.email
          }
        ])
        .select('*')
        .single();

      if (insertError) {
        console.error('Erro ao criar perfil:', insertError);
        return { success: false, error: insertError };
      }

      console.log('Novo perfil criado com sucesso:', insertData);
      return { success: true, data: insertData, action: 'created' };
    }
    
    // Se o perfil existe, atualizar
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
        email: profile.email
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      return { success: false, error: updateError };
    }

    console.log('Perfil atualizado com sucesso:', updateData);
    return { success: true, data: updateData, action: 'updated' };

  } catch (err) {
    console.error('Erro inesperado:', err);
    return { success: false, error: err };
  }
}

// Lista de usuários para adicionar
const users = [
  {
    email: 'rendasorganica@gmail.com',
    name: 'Micael Rodrigues Brandão'
  },
  {
    email: 'brenomafioletti07@gmail.com',
    name: 'Breno Marcelino'
  },
  {
    email: 'direroria@mundodastribos.com',
    name: 'Paulo Lima'
  },
  {
    email: 'julio.meirelles19@gmail.com',
    name: 'Julio Cesar Meirelles'
  },
  {
    email: 'guilhermeslwczuk@yahoo.com',
    name: 'Guilherme'
  },
  {
    email: 'gabicosta007@hotmail.com',
    name: 'Gabriel Roberto Costa Tavares'
  },
  {
    email: 'gustavoemerson92@hotmail.com',
    name: 'Emerson Gustavo Da Silva'
  },
  {
    email: 'carlinhos.costaa.curta@gmal.com',
    name: 'Carlos Costacurta'
  },
  {
    email: 'rowasilva_@hotmail.com',
    name: 'Rones Wayne'
  },
  {
    email: 'henderson.andrad@hotmail.com',
    name: 'Henderson Marcel Augusto Paes Andrade'
  },
  {
    email: 'thaisreisbueno@hotmail.com',
    name: 'Thais Reis Amador Bueno'
  },
  {
    email: 'elisveltontrader@gmail.com',
    name: 'Elisvelton Carlos Silva Teixeira'
  },
  {
    email: 'wilsonkennedysemedo2018@gmail.com',
    name: 'Wilson Kennedy Andrade Semedo'
  },
  {
    email: 'jesse159824@gmail.com',
    name: 'Jessé Melo Silva'
  },
  {
    email: 'linykermiellirochaa@gmail.com',
    name: 'Linyker Ricardo Mielli Rocha'
  },
  {
    email: 'mirandreyoliveira@gmail.com',
    name: 'Mirandrey Pereira de Oliveira Leite'
  },
  {
    email: 'pietro_mantovani@hotmail.com',
    name: 'Pietro Mantovani'
  },
  {
    email: 'luizeff2503@gmail.com',
    name: 'Luiz Eduardo Fernandes'
  },
  {
    email: 'mais18edu@gmail.com',
    name: 'Carlos Eduardo'
  },
  {
    email: 'sandromendonca91@gmail.com',
    name: 'Sandro Mendonça Araújo Junior'
  },
  {
    email: 'janacursino@hotmail.com',
    name: 'Janaína'
  },
  {
    email: 'mertendiogo@gmail.com',
    name: 'Diogo Merten'
  },
  {
    email: 'junioragrinaldo7@gmail.com',
    name: 'Agrinaldo Araujo Vieira Junior'
  },
  {
    email: 'franklincarvallho@hotmail.com',
    name: 'Franklin Queiroz De Carvalho'
  },
  {
    email: 'marcobfreitas96@outlook.com',
    name: 'Marco Bruno Freitas'
  }
];

// Função para adicionar usuários em sequência
async function addAllUsers() {
  for (const user of users) {
    try {
      const randomPhone = Math.floor(Math.random() * 900000000 + 100000000).toString();
      const timestamp = Date.now();
      const uuid = uuidv4().split('-')[0];
      const externalId = `SEC_${timestamp}_${uuid}`;

      const result = await addNewUser({
        email: user.email,
        name: user.name,
        is_premium: true,
        expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        phone_number: randomPhone,
        phone_local_code: '11',
        external_id: externalId
      });

      console.log(`Resultado para ${user.name}:`, result);
      
      // Aguardar um pouco entre cada operação para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Erro ao processar ${user.name}:`, error);
    }
  }
}

// Executar a função
addAllUsers().then(() => {
  console.log('Processo finalizado');
}).catch(error => {
  console.error('Erro no processo:', error);
});
