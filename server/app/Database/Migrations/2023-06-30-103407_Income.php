<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Income extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'incomeId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'busFleetId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'required' => true,
            ],
            'income' => [
                'type' => 'BIGINT',
                'required' => true,
                'constraint' => 20
            ],
            'totalPassengers' => [
                'type' => 'INT',
                'required' => true,
                'constraint' => 11
            ],
            'updated_at' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'null' => true
            ],
            'created_at' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'null' => true
            ]
        ]);

        $this->forge->addKey('incomeId',  TRUE);
        $this->forge->addForeignKey('busFleetId', 'busFleet', 'busFleetId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('income', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('income');
    }
}
