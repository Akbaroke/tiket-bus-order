<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Order extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'orderId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'scheduleId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'required' => true,
            ],
            'userId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'required' => true,
            ],
            'isPaid' => [
                'type' => 'BOOLEAN',
                'null' => true,
                'default' => false
            ],
            'amountSeats' => [
                'type' => 'INT',
                'constraint' => 5,
                'unsigned' => true,
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
            'expired_at' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'null' => true
            ]
        ]);

        $this->forge->addKey('orderId',  TRUE);
        $this->forge->addForeignKey('scheduleId', 'schedules', 'scheduleId', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('userId', 'users', 'userId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('order', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('order');
    }
}
