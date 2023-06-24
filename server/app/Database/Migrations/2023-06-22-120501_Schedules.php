<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Schedules extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'scheduleId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'date' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'required' => true,
                'unsigned' => true
            ],
            'from' => [
                'type' => 'VARCHAR',
                'required' => true,
                'constraint' => 36
            ],
            'to' => [
                'type' => 'VARCHAR',
                'required' => true,
                'constraint' => 36
            ],
            'time' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'required' => true,
                'unsigned' => true
            ],
            'busId' => [
                'type' => 'VARCHAR',
                'required' => true,
                'constraint' => 36
            ],
            'price' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'required' => true,
                'unsigned' => true,
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

        $this->forge->addKey('scheduleId',  TRUE);
        $this->forge->addForeignKey('from', 'station', 'stationId', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('to', 'station', 'stationId', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('busId', 'bus', 'busId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('schedules', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('schedules');
    }
}
