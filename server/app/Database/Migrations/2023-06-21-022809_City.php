<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class City extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'cityId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'unique' => true
            ],
            "amount_terminal" => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
                'default' => 0,
                'unsigned' => true
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

        $this->forge->addKey('cityId',  TRUE);
        $this->forge->createTable('cities', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('cities');
    }
}
