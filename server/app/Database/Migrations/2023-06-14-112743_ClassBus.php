<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ClassBus extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'classId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
            ],
            'className' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'unique' => true
            ],
            'format' => [
                'type' => 'VARCHAR',
                'constraint' => 3,
            ],
            'seatingCapacity' => [
                'type' => 'INT',
                'constraint' => 11,
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

        $this->forge->addKey('classId',  TRUE);
        $this->forge->createTable('classes', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('class');
    }
}
