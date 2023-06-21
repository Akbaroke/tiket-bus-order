<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Terminal extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'terminalId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'cityId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'unique' => true
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

        $this->forge->addKey('terminalId',  TRUE);
        $this->forge->addForeignKey('cityId', 'cities', 'cityId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('terminal', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('terminal');
    }
}
