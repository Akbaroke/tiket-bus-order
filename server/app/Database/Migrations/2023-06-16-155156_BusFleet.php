<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class BusFleet extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'busFleetId' => [
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

        $this->forge->addKey('busFleetId',  TRUE);
        $this->forge->createTable('busFleet', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('busFleet');
    }
}
