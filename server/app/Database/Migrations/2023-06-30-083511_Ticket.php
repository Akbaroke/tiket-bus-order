<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Ticket extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'ticketId' => [
                'type' => 'VARCHAR',
                'constraint' => 36
            ],
            'orderId' => [
                'type' => 'VARCHAR',
                'constraint' => 36,
                'required' => true,
            ],
            'customer' => [
                'type' => 'VARCHAR',
                'required' => true,
                'constraint' => 100
            ],
            'contact' => [
                'type' => 'VARCHAR',
                'required' => true,
                'constraint' => 13
            ],
            'seat' => [
                'type' => 'INT',
                'required' => true,
                'constraint' => 11,
            ],
            'code' => [
                'type' => 'VARCHAR',
                'required' => true,
                'constraint' => 8
            ],
        ]);

        $this->forge->addKey('ticketId',  TRUE);
        $this->forge->addForeignKey('orderId', 'order', 'orderId', 'CASCADE', 'CASCADE');
        $this->forge->createTable('ticket', TRUE);
    }

    public function down()
    {
        $this->forge->dropTable('ticket');
    }
}
