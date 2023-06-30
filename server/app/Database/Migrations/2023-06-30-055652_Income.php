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
                'constraint' => 20,
                'required' => true,
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
            ],
        ]);

        $this->forge->addKey('incomeId',  TRUE);
        $this->forge->addForeignKey('busFleet', 'busFleetId', 'busFleetId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('Income', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('order');
    }
}
