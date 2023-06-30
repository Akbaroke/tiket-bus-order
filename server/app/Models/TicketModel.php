<?php

namespace App\Models;

use CodeIgniter\Model;
use Ramsey\Uuid\Uuid;
use CodeIgniter\I18n\Time;

class TicketModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'ticket';
    protected $primaryKey       = 'ticketId';
    protected $casts = ['ticketId' => 'string'];
    protected $useAutoIncrement  = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['orderId', 'seat', 'customer', 'code', 'contact'];

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert = ['generateUUID'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    protected function generateUUID(array $data)
    {
        $data['data']['ticketId'] = Uuid::uuid4()->toString();
        return $data;
    }
}
