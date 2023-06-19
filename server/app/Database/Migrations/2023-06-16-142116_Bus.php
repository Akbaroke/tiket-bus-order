<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Bus extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'busId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'busFleetId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'classId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
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

        $this->forge->addKey('busId',  TRUE);
        $this->forge->addForeignKey('classId', 'classes', 'classId', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('busFleetId', 'busFleet', 'busFleetId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('bus', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('bus');
    }
}
