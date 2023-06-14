<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use Ramsey\Uuid\Uuid;

class Users extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'userId' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'default' => Uuid::uuid4()
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'unique' => true
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => '255'
            ],
            'role' => [
                'type' => "ENUM",
                'constraint' => "'user', 'admin'",
                'default' => "user"
            ],
            'created_at' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'null' => true
            ],
            'updated_at' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'null' => true
            ]
        ]);

        $this->forge->addKey('userId',  TRUE);
        $this->forge->createTable('users', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('users');
    }
}
