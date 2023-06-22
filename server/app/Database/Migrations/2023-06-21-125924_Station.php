<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Station extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'stationId' => [
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

        $this->forge->addKey('stationId',  TRUE);
        $this->forge->addForeignKey('cityId', 'cities', 'cityId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('station', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('station');
    }
}
